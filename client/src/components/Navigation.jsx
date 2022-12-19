import { Fragment } from "react";

// Third Party
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { ShieldCheckIcon, UserIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";

// API Calls
import { signOutApiCall } from "../utils/services";

// Context
import { authActions } from "../store/authSlice";

export const Navigation = () => {
	const { isAuthenticated, user } = useSelector((state) => state);
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const { mutate: mutateSignOut } = useMutation({
		mutationFn: async (data) => await signOutApiCall(data),
		onSuccess: async () => {
			dispatch(authActions.logout());
			navigate("/sign-in/");
		},
	});

	return (
		<Disclosure as="nav" className="bg-white shadow-md sticky top-0">
			<div className="mx-auto px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-full items-center justify-between">
					<div className="px-3 py-2 rounded-md text-sm font-medium flex gap-2 items-center">
						<Link to={"/"}>
							<ShieldCheckIcon className="h-9 w-9 text-blue-500 hover:text-blue-600" />
						</Link>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						{!isAuthenticated ? (
							<>
								<Link
									to={"/sign-up"}
									className="p-1 text-blue-500 hover:text-blue-600"
								>
									Sign Up
								</Link>
								<Link
									to={"/sign-in"}
									className="p-1 text-blue-500 hover:text-blue-600"
								>
									Sign In
								</Link>
							</>
						) : (
							<>
								<span className="p-1 text-blue-500">{user.email}</span>
								<Menu as="div" className="relative ml-3">
									{
										user.thumbnail ? 
										<Menu.Button className="flex rounded-full text-sm ring-1 focus:outline-none focus:ring-2 hover:ring-2">
										  <img
										    className="h-[2.6rem] w-[2.6rem] rounded-full"
										    src={`${process.env.REACT_APP_API_URL}/${user?.thumbnail}`}
										    alt={``}
										  />
										</Menu.Button>
										:
										<Menu.Button className="flex rounded-full text-sm">
											<UserIcon
												className={`h-[2.6rem] w-[2.6rem] rounded-full border text-blue-500 hover:text-blue-600`}
												style={{ top: "-20px", left: "-40px" }}
											/>
										</Menu.Button>
									}
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<Menu.Item>
												<Link
													to={"/settings"}
													className={
														"block px-4 py-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-gray-100"
													}
												>
													Your Profile
												</Link>
											</Menu.Item>
											<Menu.Item>
												<Link
													to={"#"}
													className={
														"block px-4 py-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-gray-100"
													}
													onClick={() => mutateSignOut()}
												>
													Sign out
												</Link>
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
							</>
						)}
					</div>
				</div>
			</div>
		</Disclosure>
	);
};
